using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Testing_System_Backend.Data;
using Testing_System_Backend.Models;

namespace Testing_System_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CandidateDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CandidateDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("overview")]
        public async Task<IActionResult> GetDashboardOverview()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound(new { message = "User not found" });

            // 🟢 FIXED: Mapped backend properties to exactly match frontend interface (LastDate, Status)
            var availableJobs = await _context.Jobs
                .Where(j => j.IsActive && j.LastDateToApply >= DateTime.UtcNow)
                .Select(j => new {
                    Id = j.Id,
                    Title = j.Title,
                    Department = j.Department,
                    Description = j.Description,
                    LastDate = j.LastDateToApply,                   // 🟢 Mapped to LastDate
                    Location = j.Location ?? "Not Specified",
                    Positions = j.Positions > 0 ? j.Positions : 1,
                    Salary = j.Salary ?? "As per scale",
                    Education = j.Education ?? "See details",
                    Status = "Active"                               // 🟢 Added Status field
                })
                .ToListAsync();

            var appliedJobs = await _context.Applications.Include(a => a.Job)
                .Where(a => a.UserId == user.Id)
                .Select(a => new { JobTitle = a.Job.Title, Department = a.Job.Department, AppliedDate = a.AppliedDate, Status = a.Status })
                .ToListAsync();

            var results = await _context.TestResults.Include(tr => tr.Job)
                .Where(tr => tr.UserId == user.Id)
                .Select(tr => new { JobTitle = tr.Job.Title, tr.Score, tr.TotalMarks, tr.Status, tr.TestDate })
                .ToListAsync();

            var educationHistory = await _context.Educations
                .Where(e => e.UserId == user.Id)
                .Select(e => new {
                    id = e.Id,
                    level = e.Level,
                    title = e.Title,
                    startDate = e.StartDate,
                    endDate = e.EndDate,
                    degree = e.Title,
                    institution = e.Level,
                    year = e.EndDate
                }).ToListAsync();

            // 🟢 FIXED: Ab Test sirf tab show hoga jab Candidate ne us specific Job par apply kiya ho
            var onlineTest = await _context.Applications
                .Where(a => a.UserId == user.Id) // 1. Check if the logged-in user applied
                .Select(a => a.Job)              // 2. Get the Job details for that application
                .Where(j => j.IsActive)          // 3. Ensure the job/test is still active
                .Select(j => new {
                    id = j.Id,
                    title = j.Title + " Assessment",
                    department = j.Department,
                    expiryDate = j.LastDateToApply
                })
                .FirstOrDefaultAsync();

            return Ok(new
            {
                UserData = new
                {
                    name = user.Name,
                    email = user.Email,
                    cnic = user.CNIC,
                    phone = user.PhoneNumber ?? "Not Provided",
                    city = user.City,
                    registrationDate = user.CreatedAt
                },
                Stats = new
                {
                    TotalApplied = appliedJobs.Count,
                    AvailableJobs = availableJobs.Count,
                    TestsPassed = results.Count(r => r.Status == "Passed"),
                    ActiveTests = onlineTest != null ? 1 : 0
                },
                AvailableJobs = availableJobs,
                AppliedJobs = appliedJobs,
                TestResults = results,
                EducationHistory = educationHistory,
                OnlineTest = onlineTest // 🟢 FIXED: Frontend ko data yahan se milega
            });
        }
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyForJob([FromBody] ApplyJobRequest req)
        {
            try
            {
                var userEmail = User.FindFirstValue(ClaimTypes.Email);
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null) return NotFound(new { message = "User not found" });

                // 🟢 NEW: Fetch the job to check its educational requirements
                var job = await _context.Jobs.FindAsync(req.JobId);
                if (job == null) return NotFound(new { message = "Job not found" });

                // Step 1: Check if the candidate has already applied
                var alreadyApplied = await _context.Applications
                    .AnyAsync(a => a.UserId == user.Id && a.JobId == req.JobId);

                if (alreadyApplied)
                {
                    return BadRequest(new { message = "You have already applied for this position." });
                }

                // 🟢 NEW: Step 2 - Educational Requirement Validation
                // Fetch the candidate's education profile
                var userEducationHistory = await _context.Educations
                    .Where(e => e.UserId == user.Id)
                    .ToListAsync();

                // Check if the job has a specific requirement (ignoring generic placeholder text)
                if (!string.IsNullOrEmpty(job.Education) &&
                    job.Education != "As per Advt" &&
                    job.Education != "See details" &&
                    job.Education != "Not Specified")
                {
                    string reqEdu = job.Education.ToLower();

                    // Logic to verify if candidate's degree level or title matches the requirement
                    // It also checks if the job needs "bs" and the user has a "bachelor" degree
                    bool isEligible = userEducationHistory.Any(e =>
                        (e.Level != null && e.Level.ToLower().Contains(reqEdu)) ||
                        (e.Title != null && e.Title.ToLower().Contains(reqEdu)) ||
                        (reqEdu.Contains("bs") && ((e.Level != null && e.Level.ToLower().Contains("bachelor")) || (e.Title != null && e.Title.ToLower().Contains("bachelor"))))
                    );

                    // If they don't have the required education, block the application
                    if (!isEligible)
                    {
                        return BadRequest(new { message = $"Eligibility Failed: This position strictly requires '{job.Education}'. Please update your Education Profile if you hold this qualification." });
                    }
                }

                // Step 3: Create the new application if all checks pass
                var newApplication = new Application
                {
                    UserId = user.Id,
                    JobId = req.JobId,
                    AppliedDate = DateTime.UtcNow,
                    Status = "Pending" // Default status
                };

                _context.Applications.Add(newApplication);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Successfully applied for the job!" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error applying for job", error = ex.Message });
            }
        }
        [HttpPost("add-education")]
        public async Task<IActionResult> AddEducation([FromBody] Education edu)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound();

            edu.UserId = user.Id;
            if (string.IsNullOrEmpty(edu.FilePath)) edu.FilePath = "N/A"; // Prevents rejection

            _context.Educations.Add(edu);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Added!" });
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest req)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound();

            user.Name = req.Name;
            user.PhoneNumber = req.Phone;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Updated!" });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound();

            // 🟢 Hashing check
            bool isValid = BCrypt.Net.BCrypt.Verify(req.OldPassword, user.PasswordHash);
            if (!isValid) return BadRequest(new { message = "Incorrect current password!" });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Changed!" });
        }
    }
   
    public class UpdateProfileRequest { public string Name { get; set; } = ""; public string Phone { get; set; } = ""; }
    public class ChangePasswordRequest { public string OldPassword { get; set; } = ""; public string NewPassword { get; set; } = ""; }
}
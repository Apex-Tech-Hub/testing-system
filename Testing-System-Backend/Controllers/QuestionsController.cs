using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Testing_System_Backend.Data;
using Testing_System_Backend.Models;
//using Testing_System_Backend.DTOs; // Agar aapne DTOs alag folder mein rakhe hain

namespace Testing_System_Backend.Controllers
{ 
    [ApiController]
    [Route("api/admin/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET ALL QUESTIONS (Table, Search, aur Tabs ke liye)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionResponseDto>>> GetQuestions()
        {
            var questions = await _context.Questions
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new QuestionResponseDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Category = q.Category,
                    Difficulty = q.Difficulty,
                    Correct = q.CorrectOption,
                    // Correct Option ka asli Text nikalna
                    CorrectText = q.CorrectOption == "A" ? q.OptionA :
                                  q.CorrectOption == "B" ? q.OptionB :
                                  q.CorrectOption == "C" ? q.OptionC : q.OptionD,
                    // Columns ko wapas Array mein convert karna
                    Options = new List<string> { q.OptionA, q.OptionB, q.OptionC, q.OptionD }
                })
                .ToListAsync();

            return Ok(questions);
        }

        // 2. CREATE NEW QUESTION ("Add New" button ke liye)
        [HttpPost]
        public async Task<IActionResult> CreateQuestion([FromBody] QuestionCreateDto dto)
        {
            // DTO ko database Model mein convert kar rahe hain
            var newQuestion = new Question
            {
                Text = dto.Text,
                Category = dto.Category,
                Difficulty = dto.Difficulty,
                OptionA = dto.OptionA,
                OptionB = dto.OptionB,
                OptionC = dto.OptionC,
                OptionD = dto.OptionD,
                CorrectOption = dto.CorrectOption
            };

            // Database mein save karna
            _context.Questions.Add(newQuestion);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Question added successfully!" });
        }

        // 3. UPDATE QUESTION ("Edit" button ke liye)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] QuestionUpdateDto dto)
        {
            // Database mein purana question dhoondna
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound(new { message = "Question not found." });

            // Naye data se purane data ko replace karna
            question.Text = dto.Text;
            question.Category = dto.Category;
            question.Difficulty = dto.Difficulty;
            question.OptionA = dto.OptionA;
            question.OptionB = dto.OptionB;
            question.OptionC = dto.OptionC;
            question.OptionD = dto.OptionD;
            question.CorrectOption = dto.CorrectOption;

            // Database ko update karna
            await _context.SaveChangesAsync();

            return Ok(new { message = "Question updated successfully." });
        }

        // 4. DELETE QUESTION ("Trash/Delete" button ke liye)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound();

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Question deleted successfully." });
        }
    }
}
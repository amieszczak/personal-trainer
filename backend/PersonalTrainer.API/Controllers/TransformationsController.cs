using Microsoft.AspNetCore.Mvc;
using PersonalTrainer.API.Models;
using PersonalTrainer.API.DTOs;

namespace PersonalTrainer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransformationsController : ControllerBase
{
    private static readonly List<Transformation> _transformations = new()
    {
        new Transformation { Id = 1, Name = "Marek Kowalski", Age = 35, Description = "Stracił 25 kg w 6 miesięcy", Story = "Marek przyszedł do mnie z nadwagą i brakiem energii. Wspólnie opracowaliśmy plan treningowy i dietetyczny dostosowany do jego trybu życia. Skupiliśmy się na budowaniu nawyków, które można utrzymać długoterminowo. Po 6 miesiącach ciężkiej pracy osiągnął swój cel.", Quote = "Nigdy nie myślałem, że mogę tak wyglądać. Adrian nie tylko pomógł mi schudnąć, ale też nauczył, jak żyć zdrowo każdego dnia." },
        new Transformation { Id = 2, Name = "Anna Nowak", Age = 28, Description = "Zbudowała masę mięśniową i poprawiła sylwetkę", Story = "Anna chciała nabrać pewności siebie i zbudować mocniejsze ciało. Przez 8 miesięcy pracowaliśmy nad siłą i masą mięśniową. Program obejmował trening siłowy 4 razy w tydzień oraz zbilansowaną dietę wysokobiałkową.", Quote = "Czuję się silniejsza niż kiedykolwiek. Adrian pokazał mi, że kobiety mogą i powinny trenować z ciężarami!" },
        new Transformation { Id = 3, Name = "Piotr Wiśniewski", Age = 42, Description = "Powrócił do formy po kontuzji", Story = "Piotr po kontuzji kręgosłupa potrzebował specjalistycznego podejścia. Stworzyliśmy program rehabilitacyjny, który stopniowo wprowadzał go z powrotem do pełnej aktywności. Skupiliśmy się na stabilizacji i wzmocnieniu mięśni głębokich.", Quote = "Dzięki profesjonalnemu podejściu Adriana udało mi się nie tylko wrócić do formy, ale czuję się lepiej niż przed kontuzją." },
        new Transformation { Id = 4, Name = "Karolina Lewandowska", Age = 31, Description = "Przygotowanie do pierwszego maratonu", Story = "Karolina marzyła o ukończeniu maratonu. Przez 5 miesięcy pracowaliśmy nad jej wytrzymałością, techniką biegu i siłą. Program treningowy był zindywidualizowany i dostosowywany do jej postępów.", Quote = "Ukończyłam mój pierwszy maraton dzięki Adrianowi! Jego wsparcie i wiedza były nieocenione." },
        new Transformation { Id = 5, Name = "Tomasz Zieliński", Age = 38, Description = "Transformacja sylwetki - rzeźba mięśni", Story = "Tomasz miał już doświadczenie w treningu, ale chciał przejść na wyższy poziom. Przez 4 miesiące skupiliśmy się na definicji mięśni i redukcji tkanki tłuszczowej przy zachowaniu masy mięśniowej. Program obejmował intensywne treningi i precyzyjnie zaplanowaną dietę.", Quote = "Adrian pomógł mi osiągnąć formę, o której zawsze marzyłem. Jego wiedza o treningu i diecie jest imponująca." },
        new Transformation { Id = 6, Name = "Magdalena Dąbrowska", Age = 45, Description = "Odzyskała formę i energię po ciąży", Story = "Magdalena po dwóch ciążach chciała wrócić do aktywności fizycznej i odzyskać swoją formę. Stworzyliśmy bezpieczny program, który uwzględniał jej sytuację życiową i wyzwania związane z byciem mamą. Treningi były efektywne, ale nie zabierały zbyt wiele czasu.", Quote = "Adrian zrozumiał moje potrzeby jako mamy. Program był idealny - efektywny, ale realny do wykonania." },
        new Transformation { Id = 7, Name = "Jakub Krawczyk", Age = 26, Description = "Z początkującego do zaawansowanego sportowca", Story = "Jakub rozpoczynał swoją przygodę z siłownią bez doświadczenia. Przez rok wspólnej pracy nauczyliśmy się wszystkich podstawowych ćwiczeń, zbudował solidne fundamenty siły i masy mięśniowej. Teraz sam planuje treningi na podstawie wiedzy, którą zdobył.", Quote = "Adrian nie tylko trenował mnie, ale nauczył jak to robić samodzielnie. To najlepszy nauczyciel, jakiego mogłem sobie wymarzyć." }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Transformation>> GetAll()
    {
        return Ok(_transformations);
    }

    [HttpGet("{id}")]
    public ActionResult<Transformation> GetById(int id)
    {
        var transformation = _transformations.FirstOrDefault(t => t.Id == id);
        if (transformation == null)
        {
            return NotFound(new { message = $"Transformation with ID {id} not found" });
        }
        return Ok(transformation);
    }

    [HttpGet("featured")]
    public ActionResult<IEnumerable<Transformation>> GetFeatured()
    {
        var featured = _transformations.Take(3);
        return Ok(featured);
    }

    [HttpPost]
    public ActionResult<Transformation> Create(CreateTransformationDto dto)
    {
        var transformation = new Transformation
        {
            Id = _transformations.Any() ? _transformations.Max(t => t.Id) + 1 : 1,
            Name = dto.Name,
            Age = dto.Age,
            Description = dto.Description,
            Story = dto.Story,
            Quote = dto.Quote,
            Image = dto.Image
        };

        _transformations.Add(transformation);
        return CreatedAtAction(nameof(GetById), new { id = transformation.Id }, transformation);
    }

    [HttpPut("{id}")]
    public ActionResult<Transformation> Update(int id, UpdateTransformationDto dto)
    {
        var transformation = _transformations.FirstOrDefault(t => t.Id == id);
        if (transformation == null)
        {
            return NotFound(new { message = $"Transformation with ID {id} not found" });
        }

        transformation.Name = dto.Name;
        transformation.Age = dto.Age;
        transformation.Description = dto.Description;
        transformation.Story = dto.Story;
        transformation.Quote = dto.Quote;
        transformation.Image = dto.Image;

        return Ok(transformation);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var transformation = _transformations.FirstOrDefault(t => t.Id == id);
        if (transformation == null)
        {
            return NotFound(new { message = $"Transformation with ID {id} not found" });
        }

        _transformations.Remove(transformation);
        return NoContent();
    }
}


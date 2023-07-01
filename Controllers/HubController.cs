using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using mysignalR.Hubs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mysignalR.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HubController : ControllerBase
    {

        //khai báo hub
        private readonly IHubContext<ChatHub> _hubContext;

        public HubController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        //lấy danh sách các connectionId đang kết nối
        [HttpGet("listConnectionId")]
        public async Task<IActionResult> GetListConnectionId()
        {
            return Ok(ChatHub.ListConnectionId);
        }


        // GET: api/<HubController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<HubController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<HubController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<HubController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<HubController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

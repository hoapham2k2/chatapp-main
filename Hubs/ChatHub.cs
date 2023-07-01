using Microsoft.AspNetCore.SignalR;
using mysignalR.Models;
namespace mysignalR.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(Message message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
            //await Clients.Others.SendAsync("ReceiveMessage", message);
        }

    }
}

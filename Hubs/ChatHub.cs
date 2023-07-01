using Microsoft.AspNetCore.SignalR;
using mysignalR.Models;
namespace mysignalR.Hubs
{
    public class ChatHub : Hub
    {
        //lây danh sách các connectionId đang kết nối

        public static ICollection<string> ListConnectionId { get; set; } = new List<string>();

        public ChatHub() { }

        //gọi khi có 1 client kết nối tới
        public override async Task OnConnectedAsync()
        {
            ListConnectionId.Add(Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        //gọi khi có 1 client ngắt kết nối
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            ListConnectionId.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(Message message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
            //await Clients.Others.SendAsync("ReceiveMessage", message);
        }

    }
}

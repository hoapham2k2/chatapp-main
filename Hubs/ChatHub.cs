using Microsoft.AspNetCore.SignalR;
using mysignalR.Models;
namespace mysignalR.Hubs
{
    public class ChatHub : Hub
    {
        public ChatHub() { }

        //lấy danh sách các user đang online
        public async Task GetOnlineUsers()
        {
            await Clients.All.SendAsync("ReceiveOnlineUsers", UserHandler.ConnectedIds);
        }

        public override async Task OnConnectedAsync()
        {
            UserHandler.Add(new UserHandler { ConnectionId = Context.ConnectionId, UserName = "Anonymous" });
            await base.OnConnectedAsync();
        }


        public override async Task OnDisconnectedAsync(System.Exception? exception)
        {
            UserHandler.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }


        // //sự kiện gửi User Info tới server
        public async Task SendUserInfo(string username)
        {
            UserHandler.Update(Context.ConnectionId, username);
            await GetOnlineUsers();
            await Clients.All.SendAsync("ReceiveUserInfo", username);
        }


        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }

        //su kien send message den 1 user
        public async Task SendMessageToUser(string connectionId, string message)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveMessageFromAnother", message);
        }

        // gọi khi có sự kiện 1 connection mới kết nối tới đến 1 room nào đó
        public async Task JoinRoom(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName); // thêm connectionId vào group
            // thông báo cho các client khác biết có 1 client mới tham gia vào room         
            await Clients.Group(roomName).SendAsync("ReceiveMessage", $"{Context.ConnectionId} has joined the group {roomName}.");
        }

        // gọi khi có sự kiện 1 connection ngắt kết nối tới đến 1 room nào đó
        public async Task LeaveRoom(string roomName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName); // xóa connectionId khỏi group
            // thông báo cho các client khác biết có 1 client mới rời khỏi room
            await Clients.OthersInGroup(roomName).SendAsync("ReceiveMessage", $"{Context.ConnectionId} has left the group {roomName}.");
        }

        //sự kiện gửi tin nhắn tới 1 room nào đó
        public async Task SendMessageToRoom(string roomName, string message)
        {
            await Clients.Group(roomName).SendAsync("ReceiveMessage", message);

        }


        //sự kiện gửi 1 thông báo "nhận video call" tới 1 user nào đó
        public async Task SendVideoCallRequest(string connectionId)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveVideoCallRequest", UserHandler.ConnectedIds.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId));

        }

        //sự kiện gửi 1 thông báo "đồng ý video call" tới 1 user nào đó
        public async Task SendVideoCallAccept(string connectionId)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveVideoCallAccept", UserHandler.ConnectedIds.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId));

        }

        //sự kiện gửi 1 thông báo "từ chối video call" tới 1 user nào đó
        public async Task SendVideoCallReject(string connectionId)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveVideoCallReject", UserHandler.ConnectedIds.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId));

        }


    }
}

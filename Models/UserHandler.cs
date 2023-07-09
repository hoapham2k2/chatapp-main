using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mysignalR.Models
{
    public class UserHandler
    {
        public string ConnectionId { get; set; }
        public string UserName { get; set; }

        public static ICollection<UserHandler> ConnectedIds = new List<UserHandler>();

        public static void Add(UserHandler user)
        {
            ConnectedIds.Add(user);
        }

        public static void Remove(string connectionId)
        {
            var user = ConnectedIds.FirstOrDefault(x => x.ConnectionId == connectionId);
            if (user != null)
            {
                ConnectedIds.Remove(user);
            }
        }

        // update user name khi user đăng nhập
        public static void Update(string connectionId, string userName)
        {
            var user = ConnectedIds.FirstOrDefault(x => x.ConnectionId == connectionId);
            if (user != null)
            {
                user.UserName = userName;
            }
        }



    }
}
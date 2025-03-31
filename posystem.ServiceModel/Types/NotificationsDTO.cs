using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Types
{
    [Route("/notifications", "GET")]
    public class GetNotificationsDTO : IReturn<GetNotificationsResponse> {}


    [Route("/notifications/{Id}/read", "PUT")]
    public class MarkNotificationRead : IReturnVoid
    {
        public Guid Id { get; set; }
    }


    public class GetNotificationsResponse
    {
        public List<NotificationsDTO> Results { get; set; }
    }
    public class NotificationsDTO
    {
        public Guid Id { get; set; }
        public Guid Customer_Id { get; set; }
        public string? Message { get; set; }
        public DateTime Created_At { get; set; }
        public bool Is_Read { get; set; }
    }
}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using posystem.ServiceModel;
using posystem.ServiceModel.Types;
using posystem.ServiceModel.Models;
using ServiceStack.OrmLite.Legacy;

namespace posystem.ServiceInterface.Services
{
    [Authenticate]
    public class NotificationService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public NotificationService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }
        public object Get(GetNotificationsDTO request)
        {
            var email = base.GetSession().Email; // JWT claim (email)

            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var customer = db.Single<Customers>(c => c.Email == email);

                if (customer == null)
                {
                    return new GetNotificationsResponse
                    {
                        Results = new List<NotificationsDTO>()
                    };
                }

                var notifications = db.Select<Notifications>(n => n.Customer_Id == customer.Id);

                var result = notifications.Select(n => new NotificationsDTO
                {
                    Id = n.Id,
                    Message = n.Message,
                    Is_Read = n.Is_Read,
                    Created_At = n.Created_At
                }).ToList();

                return new GetNotificationsResponse
                {
                    Results = result
                };
            }
        }

        public void Put(MarkNotificationRead request)
        {
            var email = base.GetSession().Email; // JWT claim (email)

            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var customer = db.Single<Customers>(c => c.Email == email);

                if (customer == null)
                {
                    return;
                }

                var notification = db.Single<Notifications>(n => n.Id == request.Id && n.Customer_Id == customer.Id);

                if (notification != null)
                {
                    notification.Is_Read = true;
                    db.Update(notification);
                }
            }
        }
    }
}
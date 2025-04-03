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
    public class ReportService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public ReportService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<GenerateReport> Post(GenerateReportRequest request)
        {
            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var report = db.Single<Reports>(r => r.Report_Name == request.Report_Name);

                if (report == null)
                    throw HttpError.NotFound("Report not found");

                var results = await db.SqlListAsync<Dictionary<string, object>>(report.Sql_Query, new
                {
                    StartDate = request.StartDate,
                    EndDate = request.EndDate
                });

                return new GenerateReport { Data = results };
            
            }
        }
    }
}
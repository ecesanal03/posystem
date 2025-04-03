using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Types
{
    [Route("/report/generate", "POST")]
    public class GenerateReportRequest : IReturn<GenerateReport>
    {
        public string? Report_Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class GenerateReport
    {
        public List<Dictionary<string, object>> Data { get; set; } 
    }

    public class ReturnReportError
    {
        public string? Message { get; set; }
    }
}
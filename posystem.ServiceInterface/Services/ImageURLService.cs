using System;
using System.Net.Http;
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.Web;

namespace posystem.ServiceInterface.Services
{
    [Route("/api/bookcover")]
    public class BookCoverRequest : IReturn<byte[]>
    {
        public string Url { get; set; }
    }

    public class BookCoverService : Service
    {
        private readonly HttpClient _httpClient;

        public BookCoverService()
        {
            _httpClient = new HttpClient();
        }

        public async Task<object> Get(BookCoverRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Url))
                {
                    return HttpError.BadRequest("URL parameter is required");
                }

                var response = await _httpClient.GetAsync(request.Url);
                
                if (!response.IsSuccessStatusCode)
                {
                    return HttpError.NotFound("Image not found");
                }

                var contentType = response.Content.Headers.ContentType?.ToString();
                var imageBytes = await response.Content.ReadAsByteArrayAsync();

                // Set the content type to match the original image
                Response.ContentType = contentType ?? "image/jpeg";
                
                return imageBytes;
            }
            catch (Exception ex)
            {
                return new HttpError(System.Net.HttpStatusCode.InternalServerError, "Failed to retrieve image: " + ex.Message);
            }
        }
    }
}
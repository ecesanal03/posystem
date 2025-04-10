using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using posystem.ServiceModel.Models;

public class TokenService
{
    private static readonly string _secretKey = "my-very-secure-secret-key-with-32-bytes-long";
    public static string GenerateJwtToken(string email)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, email),
            new Claim("email", email), // You can add more claims here
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "http://localhost", // Changed from https to http
            audience: "http://localhost",  // Changed from https to http
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),  // Set token expiration time
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

//public static string GenerateJwtToken(string email)
//{
//    var claims = new[]
//    {
//            new Claim(ClaimTypes.Name, email),  // Store the email in the JWT
//            // Add other claims as necessary (e.g., roles, permissions, etc.)
//        };

//    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
//    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//    var token = new JwtSecurityToken(
//        issuer: "your-issuer",  // Define your issuer
//        audience: "your-audience",  // Define your audience
//        claims: claims,
//        expires: DateTime.Now.AddDays(7),  // Set an expiration date
//        signingCredentials: creds
//    );my-very-secure-secret-key-with-32-bytes-long

//    return new JwtSecurityTokenHandler().WriteToken(token);
//}
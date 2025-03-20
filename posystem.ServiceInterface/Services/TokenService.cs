using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using posystem.ServiceModel.Models;

public class TokenService
{
    public static string GenerateJwtTokenForLogin(Customers customer)
    {
        var jwt = new JwtSecurityToken(
            issuer: "https://localhost", // Placeholder for the issuer
            audience: "https://localhost", // Placeholder for the audience
            claims: new[] { new Claim("Email", customer.Email) },
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my-very-secure-secret-key-with-32-bytes-long")), SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
}

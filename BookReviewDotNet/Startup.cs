using BookReviewDotNet.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace BookReviewDotNet
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // aici adaugam serviciile necesare aplicatiei
        public void ConfigureServices(IServiceCollection services)
{
    // configurare cors
    services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", builder =>
            builder.AllowAnyOrigin()  
                   .AllowAnyMethod()  
                   .AllowAnyHeader()); 
    });

    // add servicii mvc / api
    services.AddControllers();
}

        //aici config pipelinul de procesare al cererilor http
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{   
    
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    
    app.UseCors("AllowAll");

   
    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    // config endpoints pt api
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers(); 
    });
    
}
    }
}

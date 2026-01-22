import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, 
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('CRM Project API')
    .setDescription('User Auth, SMS Verification va CRM tizimi uchun API hujjatlari')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  
  console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
  console.log(`📄 Swagger hujjati: http://localhost:${PORT}/api/docs`);
}
bootstrap();
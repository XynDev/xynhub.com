import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { swaggerUI } from "@hono/swagger-ui";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";

// Public routes
import publicPages from "./routes/public/pages.js";
import publicBlogs from "./routes/public/blogs.js";
import publicPortfolios from "./routes/public/portfolios.js";
import publicServices from "./routes/public/services.js";
import publicNavigation from "./routes/public/navigation.js";
import publicSettings from "./routes/public/settings.js";
import publicFaqs from "./routes/public/faqs.js";
import publicTestimonials from "./routes/public/testimonials.js";
import publicTeam from "./routes/public/team.js";
import publicFooter from "./routes/public/footer.js";
import publicContact from "./routes/public/contact.js";
import publicNewsletter from "./routes/public/newsletter.js";

// Admin routes
import adminPages from "./routes/admin/pages.js";
import adminBlogs from "./routes/admin/blogs.js";
import adminPortfolios from "./routes/admin/portfolios.js";
import adminServices from "./routes/admin/services.js";
import adminNavigation from "./routes/admin/navigation.js";
import adminSettings from "./routes/admin/settings.js";
import adminFaqs from "./routes/admin/faqs.js";
import adminTestimonials from "./routes/admin/testimonials.js";
import adminTeam from "./routes/admin/team.js";
import adminFooter from "./routes/admin/footer.js";
import adminMedia from "./routes/admin/media.js";
import adminContactMessages from "./routes/admin/contact-messages.js";
import adminNewsletter from "./routes/admin/newsletter.js";

const app = new Hono();

// Global middleware
app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:3001,https://xynhub.com,https://www.xynhub.com,https://admin.xynhub.com").split(","),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Health check
app.get("/", (c) =>
  c.json({ status: "ok", service: "xynhub-api", version: "1.0.0" })
);

app.get("/health", (c) =>
  c.json({ status: "healthy", timestamp: new Date().toISOString() })
);

// ── Swagger UI & OpenAPI Spec ──
app.get("/api/docs", swaggerUI({ url: "/api/openapi.json" }));

app.get("/api/openapi.json", (c) => {
  return c.json({
    openapi: "3.0.3",
    info: {
      title: "XYNHub CMS API",
      description:
        "Content Management System API for XYNHub website. Public endpoints require no auth. Admin endpoints require Bearer token from authenticated admin user.",
      version: "1.0.0",
      contact: { email: "ilhamram332@gmail.com" },
    },
    servers: [
      { url: "http://localhost:3000", description: "Local Development" },
      { url: "https://api.xynhub.com", description: "Production" },
    ],
    tags: [
      { name: "Public - Pages", description: "Static page content" },
      { name: "Public - Blogs", description: "Blog posts" },
      { name: "Public - Portfolios", description: "Portfolio projects" },
      { name: "Public - Navigation", description: "Navigation menu" },
      { name: "Public - Settings", description: "Site settings" },
      { name: "Public - FAQs", description: "FAQ items" },
      { name: "Public - Testimonials", description: "Testimonials" },
      { name: "Public - Team", description: "Team members" },
      { name: "Public - Footer", description: "Footer content" },
      { name: "Admin - Pages", description: "Manage page content" },
      { name: "Admin - Blogs", description: "Manage blog posts" },
      { name: "Admin - Portfolios", description: "Manage portfolios" },
      { name: "Admin - Navigation", description: "Manage navigation" },
      { name: "Admin - Settings", description: "Manage site settings" },
      { name: "Admin - FAQs", description: "Manage FAQs" },
      { name: "Admin - Testimonials", description: "Manage testimonials" },
      { name: "Admin - Team", description: "Manage team members" },
      { name: "Admin - Footer", description: "Manage footer" },
      { name: "Admin - Media", description: "Media uploads" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Supabase JWT token. Only whitelisted admin emails can access admin endpoints.",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "object" },
            message: { type: "string" },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array", items: { type: "object" } },
            pagination: {
              type: "object",
              properties: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                total: { type: "integer" },
                total_pages: { type: "integer" },
              },
            },
          },
        },
        Blog: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            slug: { type: "string" },
            title: { type: "string" },
            category: { type: "string" },
            tag: { type: "string", nullable: true },
            description: { type: "string" },
            content: { type: "object" },
            author_name: { type: "string" },
            author_role: { type: "string" },
            author_image: { type: "string", nullable: true },
            image_url: { type: "string", nullable: true },
            icon: { type: "string", nullable: true },
            is_featured: { type: "boolean" },
            read_time: { type: "string", nullable: true },
            published_at: { type: "string", format: "date-time", nullable: true },
            is_active: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Portfolio: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            slug: { type: "string" },
            title: { type: "string" },
            tag: { type: "string" },
            description: { type: "string", nullable: true },
            image_url: { type: "string", nullable: true },
            tech_stack: { type: "object", nullable: true },
            metrics: { type: "object", nullable: true },
            sort_order: { type: "integer" },
            is_active: { type: "boolean" },
          },
        },
        NavigationItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            label: { type: "string" },
            path: { type: "string" },
            sort_order: { type: "integer" },
            is_active: { type: "boolean" },
            parent_id: { type: "string", nullable: true },
          },
        },
        Testimonial: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            quote: { type: "string" },
            author_name: { type: "string" },
            author_role: { type: "string" },
            author_initials: { type: "string" },
            span_class: { type: "string", nullable: true },
            sort_order: { type: "integer" },
            is_active: { type: "boolean" },
          },
        },
        TeamMember: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            role: { type: "string" },
            group_name: { type: "string" },
            image_url: { type: "string", nullable: true },
            sort_order: { type: "integer" },
            is_active: { type: "boolean" },
          },
        },
        FAQ: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            question: { type: "string" },
            answer: { type: "string" },
            page_slug: { type: "string" },
            sort_order: { type: "integer" },
            is_active: { type: "boolean" },
          },
        },
        Media: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            file_name: { type: "string" },
            file_url: { type: "string" },
            file_path: { type: "string" },
            file_type: { type: "string" },
            file_size: { type: "integer" },
            alt_text: { type: "string", nullable: true },
          },
        },
      },
    },
    paths: {
      // ── PUBLIC ENDPOINTS ──
      "/api/v1/pages/{slug}": {
        get: {
          tags: ["Public - Pages"],
          summary: "Get all sections for a page",
          parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" }, description: "Page slug (home, about, services, service-detail, process, blogs, portofolio)" }],
          responses: { "200": { description: "Page content sections as key-value object" } },
        },
      },
      "/api/v1/pages/{slug}/{section}": {
        get: {
          tags: ["Public - Pages"],
          summary: "Get specific section of a page",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
            { name: "section", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "Section content" }, "404": { description: "Not found" } },
        },
      },
      "/api/v1/blogs": {
        get: {
          tags: ["Public - Blogs"],
          summary: "List published blogs",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "per_page", in: "query", schema: { type: "integer", default: 20 } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "featured", in: "query", schema: { type: "string", enum: ["true", "false"] } },
          ],
          responses: { "200": { description: "Paginated blog list" } },
        },
      },
      "/api/v1/blogs/{slug}": {
        get: {
          tags: ["Public - Blogs"],
          summary: "Get blog detail by slug",
          parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Blog detail" }, "404": { description: "Not found" } },
        },
      },
      "/api/v1/portfolios": {
        get: { tags: ["Public - Portfolios"], summary: "List active portfolios", responses: { "200": { description: "Portfolio list" } } },
      },
      "/api/v1/portfolios/{slug}": {
        get: {
          tags: ["Public - Portfolios"],
          summary: "Get portfolio detail by slug",
          parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Portfolio with detail" }, "404": { description: "Not found" } },
        },
      },
      "/api/v1/navigation": { get: { tags: ["Public - Navigation"], summary: "Get active navigation items", responses: { "200": { description: "Navigation items" } } } },
      "/api/v1/settings": { get: { tags: ["Public - Settings"], summary: "Get all site settings", responses: { "200": { description: "Settings key-value map" } } } },
      "/api/v1/faqs": {
        get: {
          tags: ["Public - FAQs"],
          summary: "Get FAQs",
          parameters: [{ name: "page", in: "query", schema: { type: "string", default: "home" }, description: "Page slug to filter FAQs" }],
          responses: { "200": { description: "FAQ list" } },
        },
      },
      "/api/v1/testimonials": { get: { tags: ["Public - Testimonials"], summary: "Get active testimonials", responses: { "200": { description: "Testimonials" } } } },
      "/api/v1/team": { get: { tags: ["Public - Team"], summary: "Get team members grouped by team", responses: { "200": { description: "Team members grouped" } } } },
      "/api/v1/footer": { get: { tags: ["Public - Footer"], summary: "Get footer sections", responses: { "200": { description: "Footer content" } } } },
      // ── ADMIN ENDPOINTS ──
      "/api/v1/admin/pages": {
        get: { tags: ["Admin - Pages"], summary: "List all page contents", security: [{ BearerAuth: [] }], responses: { "200": { description: "All page contents" } } },
      },
      "/api/v1/admin/pages/{slug}": {
        get: { tags: ["Admin - Pages"], summary: "Get page sections by slug", security: [{ BearerAuth: [] }], parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Page sections" } } },
      },
      "/api/v1/admin/pages/{slug}/{section}": {
        put: { tags: ["Admin - Pages"], summary: "Upsert page section", security: [{ BearerAuth: [] }], parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }, { name: "section", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object", properties: { content: { type: "object" }, sort_order: { type: "integer" } } } } } }, responses: { "200": { description: "Updated section" } } },
        delete: { tags: ["Admin - Pages"], summary: "Delete page section", security: [{ BearerAuth: [] }], parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }, { name: "section", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
      "/api/v1/admin/blogs": {
        get: { tags: ["Admin - Blogs"], summary: "List all blogs (admin)", security: [{ BearerAuth: [] }], parameters: [{ name: "page", in: "query", schema: { type: "integer" } }, { name: "per_page", in: "query", schema: { type: "integer" } }], responses: { "200": { description: "Paginated blogs" } } },
        post: { tags: ["Admin - Blogs"], summary: "Create blog", security: [{ BearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Blog" } } } }, responses: { "201": { description: "Created" } } },
      },
      "/api/v1/admin/blogs/{id}": {
        get: { tags: ["Admin - Blogs"], summary: "Get blog by ID", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Blog detail" } } },
        put: { tags: ["Admin - Blogs"], summary: "Update blog", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Blog" } } } }, responses: { "200": { description: "Updated" } } },
        delete: { tags: ["Admin - Blogs"], summary: "Delete blog", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
      "/api/v1/admin/portfolios": {
        get: { tags: ["Admin - Portfolios"], summary: "List portfolios", security: [{ BearerAuth: [] }], responses: { "200": { description: "All portfolios" } } },
        post: { tags: ["Admin - Portfolios"], summary: "Create portfolio", security: [{ BearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Portfolio" } } } }, responses: { "201": { description: "Created" } } },
      },
      "/api/v1/admin/portfolios/{id}": {
        get: { tags: ["Admin - Portfolios"], summary: "Get portfolio by ID", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Portfolio detail" } } },
        put: { tags: ["Admin - Portfolios"], summary: "Update portfolio", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Updated" } } },
        delete: { tags: ["Admin - Portfolios"], summary: "Delete portfolio", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
      "/api/v1/admin/navigation": {
        get: { tags: ["Admin - Navigation"], summary: "List navigation items", security: [{ BearerAuth: [] }], responses: { "200": { description: "All nav items" } } },
        post: { tags: ["Admin - Navigation"], summary: "Create nav item", security: [{ BearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/NavigationItem" } } } }, responses: { "201": { description: "Created" } } },
      },
      "/api/v1/admin/navigation/{id}": {
        put: { tags: ["Admin - Navigation"], summary: "Update nav item", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Updated" } } },
        delete: { tags: ["Admin - Navigation"], summary: "Delete nav item", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
      "/api/v1/admin/settings": {
        get: { tags: ["Admin - Settings"], summary: "List all settings", security: [{ BearerAuth: [] }], responses: { "200": { description: "All settings" } } },
      },
      "/api/v1/admin/settings/{key}": {
        put: { tags: ["Admin - Settings"], summary: "Upsert setting", security: [{ BearerAuth: [] }], parameters: [{ name: "key", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object", properties: { value: { type: "object" } } } } } }, responses: { "200": { description: "Updated" } } },
        delete: { tags: ["Admin - Settings"], summary: "Delete setting", security: [{ BearerAuth: [] }], parameters: [{ name: "key", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
      "/api/v1/admin/faqs": {
        get: { tags: ["Admin - FAQs"], summary: "List all FAQs", security: [{ BearerAuth: [] }], responses: { "200": { description: "All FAQs" } } },
        post: { tags: ["Admin - FAQs"], summary: "Create FAQ", security: [{ BearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/FAQ" } } } }, responses: { "201": { description: "Created" } } },
      },
      "/api/v1/admin/faqs/{id}": {
        put: { tags: ["Admin - FAQs"], summary: "Update FAQ", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Updated" } } },
        delete: { tags: ["Admin - FAQs"], summary: "Delete FAQ", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
      "/api/v1/admin/testimonials": {
        get: { tags: ["Admin - Testimonials"], summary: "List testimonials", security: [{ BearerAuth: [] }], responses: { "200": { description: "All testimonials" } } },
        post: { tags: ["Admin - Testimonials"], summary: "Create testimonial", security: [{ BearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Testimonial" } } } }, responses: { "201": { description: "Created" } } },
      },
      "/api/v1/admin/testimonials/{id}": {
        put: { tags: ["Admin - Testimonials"], summary: "Update testimonial", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Updated" } } },
        delete: { tags: ["Admin - Testimonials"], summary: "Delete testimonial", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
      "/api/v1/admin/team": {
        get: { tags: ["Admin - Team"], summary: "List team members", security: [{ BearerAuth: [] }], responses: { "200": { description: "All team members" } } },
        post: { tags: ["Admin - Team"], summary: "Create team member", security: [{ BearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/TeamMember" } } } }, responses: { "201": { description: "Created" } } },
      },
      "/api/v1/admin/team/{id}": {
        put: { tags: ["Admin - Team"], summary: "Update team member", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Updated" } } },
        delete: { tags: ["Admin - Team"], summary: "Delete team member", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
      "/api/v1/admin/footer": {
        get: { tags: ["Admin - Footer"], summary: "List footer sections", security: [{ BearerAuth: [] }], responses: { "200": { description: "All footer sections" } } },
        post: { tags: ["Admin - Footer"], summary: "Create footer section", security: [{ BearerAuth: [] }], responses: { "201": { description: "Created" } } },
      },
      "/api/v1/admin/footer/{id}": {
        put: { tags: ["Admin - Footer"], summary: "Update footer section", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Updated" } } },
        delete: { tags: ["Admin - Footer"], summary: "Delete footer section", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
      "/api/v1/admin/media": {
        get: { tags: ["Admin - Media"], summary: "List media files", security: [{ BearerAuth: [] }], parameters: [{ name: "page", in: "query", schema: { type: "integer" } }, { name: "per_page", in: "query", schema: { type: "integer" } }], responses: { "200": { description: "Paginated media" } } },
      },
      "/api/v1/admin/media/upload": {
        post: { tags: ["Admin - Media"], summary: "Upload media file", security: [{ BearerAuth: [] }], requestBody: { content: { "multipart/form-data": { schema: { type: "object", properties: { file: { type: "string", format: "binary" }, alt_text: { type: "string" } }, required: ["file"] } } } }, responses: { "201": { description: "Uploaded" } } },
      },
      "/api/v1/admin/media/{id}": {
        delete: { tags: ["Admin - Media"], summary: "Delete media", security: [{ BearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deleted" } } },
      },
    },
  });
});

// ── Public Routes ──
app.route("/api/v1/pages", publicPages);
app.route("/api/v1/blogs", publicBlogs);
app.route("/api/v1/portfolios", publicPortfolios);
app.route("/api/v1/services", publicServices);
app.route("/api/v1/navigation", publicNavigation);
app.route("/api/v1/settings", publicSettings);
app.route("/api/v1/faqs", publicFaqs);
app.route("/api/v1/testimonials", publicTestimonials);
app.route("/api/v1/team", publicTeam);
app.route("/api/v1/footer", publicFooter);
app.route("/api/v1/contact", publicContact);
app.route("/api/v1/newsletter", publicNewsletter);

// ── Admin Routes (protected) ──
const admin = new Hono();
admin.use("*", authMiddleware);
admin.route("/pages", adminPages);
admin.route("/blogs", adminBlogs);
admin.route("/portfolios", adminPortfolios);
admin.route("/services", adminServices);
admin.route("/navigation", adminNavigation);
admin.route("/settings", adminSettings);
admin.route("/faqs", adminFaqs);
admin.route("/testimonials", adminTestimonials);
admin.route("/team", adminTeam);
admin.route("/footer", adminFooter);
admin.route("/media", adminMedia);
admin.route("/contact-messages", adminContactMessages);
admin.route("/newsletter", adminNewsletter);

app.route("/api/v1/admin", admin);

// Error handler
app.onError(errorHandler);

// 404
app.notFound((c) =>
  c.json({ success: false, error: "Not found" }, 404)
);

export default app;

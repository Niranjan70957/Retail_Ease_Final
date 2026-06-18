package com.project.ecom.config;

import com.project.ecom.model.Product;
import com.project.ecom.repository.Repo;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Polygon;
import java.awt.RenderingHints;
import java.awt.geom.Arc2D;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Component
@ConditionalOnProperty(
        name = "app.catalog.seed-enabled",
        havingValue = "true",
        matchIfMissing = true
)
public class CatalogDataSeeder implements ApplicationRunner {

    private static final int IMAGE_WIDTH = 1000;
    private static final int IMAGE_HEIGHT = 750;

    private final Repo productRepository;

    public CatalogDataSeeder(Repo productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        if (productRepository.count() > 0) {
            return;
        }

        for (SeedProduct seed : sampleProducts()) {
            Product product = new Product();
            product.setName(seed.name());
            product.setDescription(seed.description());
            product.setBrand(seed.brand());
            product.setPrice(seed.price());
            product.setCategory(seed.category());
            product.setReleaseDate(Date.valueOf(seed.releaseDate()));
            product.setStockQuantity(seed.stockQuantity());
            product.setProductAvailable(true);
            product.setImageName(seed.slug() + ".png");
            product.setImageType("image/png");
            product.setImageData(createProductImage(seed));
            productRepository.save(product);
        }
    }

    private List<SeedProduct> sampleProducts() {
        return List.of(
                new SeedProduct(
                        "pulse-pro-headphones",
                        "Pulse Pro Wireless Headphones",
                        "NovaSound",
                        "Headphone",
                        new BigDecimal("89.99"),
                        24,
                        LocalDate.of(2025, 9, 12),
                        "Comfort-fit wireless headphones with active noise cancellation and 36-hour battery life.",
                        new Color(255, 79, 104),
                        new Color(36, 32, 63)
                ),
                new SeedProduct(
                        "aerobook-14",
                        "AeroBook 14 Laptop",
                        "Lumina",
                        "Laptop",
                        new BigDecimal("899.00"),
                        12,
                        LocalDate.of(2025, 8, 20),
                        "A lightweight 14-inch productivity laptop with a vivid display, fast storage, and all-day battery.",
                        new Color(98, 227, 213),
                        new Color(35, 38, 55)
                ),
                new SeedProduct(
                        "pocket-x5",
                        "Pocket X5 Smartphone",
                        "Orbit",
                        "Mobile",
                        new BigDecimal("649.00"),
                        18,
                        LocalDate.of(2025, 10, 4),
                        "A compact 5G smartphone with a bright OLED display, dual camera system, and rapid charging.",
                        new Color(93, 79, 255),
                        new Color(255, 255, 255)
                ),
                new SeedProduct(
                        "snap-mini-camera",
                        "Snap Mini Camera",
                        "PixelCraft",
                        "Electronics",
                        new BigDecimal("129.50"),
                        30,
                        LocalDate.of(2025, 6, 18),
                        "A pocket-sized digital camera for quick travel photos, video clips, and instant sharing.",
                        new Color(255, 210, 63),
                        new Color(35, 38, 55)
                ),
                new SeedProduct(
                        "arcade-go-controller",
                        "Arcade Go Controller",
                        "PlayForge",
                        "Toys",
                        new BigDecimal("59.99"),
                        20,
                        LocalDate.of(2025, 7, 2),
                        "A responsive wireless game controller with customizable buttons and multi-platform support.",
                        new Color(255, 127, 50),
                        new Color(255, 255, 255)
                ),
                new SeedProduct(
                        "metro-runner",
                        "Metro Runner Sneakers",
                        "Northline",
                        "Fashion",
                        new BigDecimal("74.00"),
                        16,
                        LocalDate.of(2025, 5, 24),
                        "Everyday lightweight sneakers with cushioned support, breathable panels, and a flexible sole.",
                        new Color(18, 180, 166),
                        new Color(255, 255, 255)
                ),
                new SeedProduct(
                        "studio-buds",
                        "Studio Buds",
                        "EchoDrop",
                        "Headphone",
                        new BigDecimal("49.99"),
                        42,
                        LocalDate.of(2025, 11, 8),
                        "Compact true-wireless earbuds with clear calls, balanced sound, and a colorful charging case.",
                        new Color(237, 109, 188),
                        new Color(255, 255, 255)
                ),
                new SeedProduct(
                        "flexpad-11",
                        "FlexPad 11 Tablet",
                        "Kinetic",
                        "Electronics",
                        new BigDecimal("379.00"),
                        14,
                        LocalDate.of(2025, 9, 28),
                        "An 11-inch entertainment and study tablet with stereo speakers and stylus-ready display.",
                        new Color(77, 144, 255),
                        new Color(255, 255, 255)
                )
        );
    }

    private byte[] createProductImage(SeedProduct seed) throws Exception {
        BufferedImage image = new BufferedImage(
                IMAGE_WIDTH,
                IMAGE_HEIGHT,
                BufferedImage.TYPE_INT_RGB
        );
        Graphics2D graphics = image.createGraphics();

        graphics.setRenderingHint(
                RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON
        );
        graphics.setColor(seed.background());
        graphics.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

        drawBackdrop(graphics, seed);
        drawProduct(graphics, seed);
        drawLabels(graphics, seed);
        graphics.dispose();

        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            ImageIO.write(image, "png", output);
            return output.toByteArray();
        }
    }

    private void drawBackdrop(Graphics2D graphics, SeedProduct seed) {
        graphics.setColor(withAlpha(Color.WHITE, 42));
        graphics.fillRoundRect(90, 85, 820, 520, 48, 48);

        graphics.setColor(withAlpha(seed.foreground(), 30));
        graphics.fillOval(680, 70, 260, 260);
        graphics.fillOval(-80, 500, 330, 330);
    }

    private void drawProduct(Graphics2D graphics, SeedProduct seed) {
        graphics.setStroke(new BasicStroke(28, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        graphics.setColor(seed.foreground());

        switch (seed.category()) {
            case "Laptop" -> drawLaptop(graphics);
            case "Mobile" -> drawMobile(graphics, false);
            case "Headphone" -> {
                if (seed.name().contains("Buds")) {
                    drawEarbuds(graphics);
                } else {
                    drawHeadphones(graphics);
                }
            }
            case "Toys" -> drawController(graphics);
            case "Fashion" -> drawSneaker(graphics);
            default -> {
                if (seed.name().contains("Tablet")) {
                    drawMobile(graphics, true);
                } else {
                    drawCamera(graphics);
                }
            }
        }
    }

    private void drawLaptop(Graphics2D graphics) {
        graphics.draw(new RoundRectangle2D.Double(260, 150, 480, 310, 28, 28));
        graphics.drawLine(215, 515, 785, 515);
        graphics.drawLine(285, 460, 235, 515);
        graphics.drawLine(715, 460, 765, 515);
        graphics.setStroke(new BasicStroke(14));
        graphics.drawLine(440, 490, 560, 490);
    }

    private void drawMobile(Graphics2D graphics, boolean tablet) {
        int width = tablet ? 390 : 260;
        int height = tablet ? 430 : 470;
        int x = (IMAGE_WIDTH - width) / 2;
        int y = 105;
        graphics.draw(new RoundRectangle2D.Double(x, y, width, height, 48, 48));
        graphics.setStroke(new BasicStroke(15));
        graphics.drawOval(IMAGE_WIDTH / 2 - 8, y + 24, 16, 16);
        graphics.drawLine(IMAGE_WIDTH / 2 - 45, y + height - 28, IMAGE_WIDTH / 2 + 45, y + height - 28);
    }

    private void drawHeadphones(Graphics2D graphics) {
        graphics.draw(new Arc2D.Double(280, 135, 440, 400, 20, 140, Arc2D.OPEN));
        graphics.fillRoundRect(245, 330, 110, 210, 40, 40);
        graphics.fillRoundRect(645, 330, 110, 210, 40, 40);
    }

    private void drawEarbuds(Graphics2D graphics) {
        graphics.setStroke(new BasicStroke(24));
        graphics.drawArc(310, 150, 160, 180, 20, 250);
        graphics.drawArc(530, 150, 160, 180, -90, 250);
        graphics.fillRoundRect(365, 350, 270, 170, 55, 55);
        graphics.setColor(withAlpha(Color.WHITE, 120));
        graphics.fillRoundRect(395, 380, 210, 70, 28, 28);
    }

    private void drawCamera(Graphics2D graphics) {
        graphics.fillRoundRect(245, 225, 510, 300, 45, 45);
        graphics.fillRoundRect(325, 175, 180, 85, 28, 28);
        graphics.setColor(withAlpha(Color.WHITE, 190));
        graphics.fillOval(385, 250, 230, 230);
        graphics.setColor(new Color(35, 38, 55));
        graphics.fillOval(435, 300, 130, 130);
    }

    private void drawController(Graphics2D graphics) {
        Polygon body = new Polygon(
                new int[]{300, 385, 615, 700, 755, 655, 560, 440, 345, 245},
                new int[]{245, 190, 190, 245, 465, 520, 425, 425, 520, 465},
                10
        );
        graphics.fillPolygon(body);
        graphics.setColor(seedContrast(graphics.getColor()));
        graphics.setStroke(new BasicStroke(20));
        graphics.drawLine(350, 320, 450, 320);
        graphics.drawLine(400, 270, 400, 370);
        graphics.fillOval(595, 280, 34, 34);
        graphics.fillOval(655, 340, 34, 34);
    }

    private void drawSneaker(Graphics2D graphics) {
        Polygon shoe = new Polygon(
                new int[]{230, 430, 555, 650, 790, 820, 775, 295, 210},
                new int[]{390, 220, 300, 375, 420, 505, 540, 540, 495},
                9
        );
        graphics.fillPolygon(shoe);
        graphics.setColor(withAlpha(Color.WHITE, 210));
        graphics.setStroke(new BasicStroke(15));
        graphics.drawLine(270, 485, 775, 485);
        graphics.drawLine(455, 305, 570, 390);
        graphics.drawLine(420, 340, 530, 420);
    }

    private void drawLabels(Graphics2D graphics, SeedProduct seed) {
        graphics.setColor(seed.foreground());
        graphics.setFont(new Font("SansSerif", Font.BOLD, 26));
        graphics.drawString(seed.category().toUpperCase(), 112, 130);

        graphics.setFont(new Font("SansSerif", Font.BOLD, 42));
        drawCenteredText(graphics, seed.name(), 650);
    }

    private void drawCenteredText(Graphics2D graphics, String text, int y) {
        FontMetrics metrics = graphics.getFontMetrics();
        int x = (IMAGE_WIDTH - metrics.stringWidth(text)) / 2;
        graphics.drawString(text, Math.max(40, x), y);
    }

    private Color withAlpha(Color color, int alpha) {
        return new Color(color.getRed(), color.getGreen(), color.getBlue(), alpha);
    }

    private Color seedContrast(Color color) {
        int luminance = color.getRed() + color.getGreen() + color.getBlue();
        return luminance > 420 ? new Color(35, 38, 55) : Color.WHITE;
    }

    private record SeedProduct(
            String slug,
            String name,
            String brand,
            String category,
            BigDecimal price,
            int stockQuantity,
            LocalDate releaseDate,
            String description,
            Color background,
            Color foreground
    ) {
    }
}

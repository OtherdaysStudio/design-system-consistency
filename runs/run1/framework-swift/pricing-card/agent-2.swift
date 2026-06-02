import SwiftUI

struct PricingCard: View {
    var body: some View {
        DSStack(.vertical, gap: .lg) {
            DSBadge("Most popular", tone: .info)

            DSStack(.vertical, gap: .xs) {
                DSText("Pro", .heading)
                DSText("Everything you need to go further.", .body, color: .dsTextSecondary)
            }

            DSStack(.horizontal, gap: .xs) {
                DSText("$29", .display)
                DSText("/mo", .caption, color: .dsTextMuted)
            }

            DSStack(.vertical, gap: .sm) {
                DSText("Unlimited high-resolution exports", .body)
                DSText("Advanced editing and presets", .body)
                DSText("Priority support", .body)
            }

            DSButton("Choose Pro") { }
                .dsButtonStyle(.primary, .lg)
                .frame(maxWidth: .infinity)
        }
        .dsCard(.elevated)
    }
}

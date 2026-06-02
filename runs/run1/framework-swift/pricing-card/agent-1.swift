import SwiftUI

struct PricingCard: View {
    private let features = [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
    ]

    var body: some View {
        DSStack(.vertical, gap: .lg) {
            // Status pill
            DSStack(.horizontal, gap: .none) {
                DSBadge("Most popular", tone: .info)
                Spacer(minLength: DS.Spacing.none)
            }

            // Tier name + description
            DSStack(.vertical, gap: .xs) {
                DSText("Pro", .heading)
                DSText("Everything you need to ship faster.", .body, color: .dsTextSecondary)
            }

            // Price + caption
            DSStack(.horizontal, gap: .xs) {
                DSText("$29", .display)
                DSText("/mo", .caption, color: .dsTextSecondary)
            }

            // Feature lines
            DSStack(.vertical, gap: .sm) {
                ForEach(features, id: \.self) { feature in
                    DSText(feature, .body)
                }
            }

            // Full-width primary CTA
            DSButton("Choose Pro") {}
                .dsButtonStyle(.primary, .lg)
                .frame(maxWidth: .infinity)
        }
        .dsCard(.elevated)
    }
}

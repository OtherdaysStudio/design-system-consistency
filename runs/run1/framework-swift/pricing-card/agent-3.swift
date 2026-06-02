import SwiftUI

struct PricingCard: View {
    private let features = [
        "Unlimited high-res exports",
        "Advanced editing filters",
        "Priority customer support"
    ]

    var body: some View {
        DSStack(.vertical, gap: .lg) {
            DSBadge("Most popular", tone: .info)

            DSStack(.vertical, gap: .xs) {
                DSText("Pro", .heading)
                DSText("Everything you need to shoot like a pro.", .body, color: .dsTextSecondary)
            }

            DSStack(.horizontal, gap: .xs) {
                DSText("$29", .display)
                DSText("/mo", .caption, color: .dsTextSecondary)
            }

            DSStack(.vertical, gap: .sm) {
                ForEach(features, id: \.self) { feature in
                    DSText(feature, .body)
                }
            }

            DSButton("Choose Pro") {}
                .dsButtonStyle(.primary, .lg)
                .frame(maxWidth: .infinity)
        }
        .dsCard(.elevated)
    }
}

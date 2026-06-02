import SwiftUI

struct PricingCard: View {
    private let features = [
        "Unlimited high-res exports",
        "Priority RAW processing",
        "Advanced color grading tools"
    ]

    var body: some View {
        DSStack(.vertical, gap: .lg) {
            DSBadge("Most popular", tone: .info)

            DSStack(.vertical, gap: .xs) {
                DSText("Pro", .heading)
                DSText("For photographers who ship every day.", .body, color: .dsTextSecondary)
            }

            DSStack(.horizontal, gap: .xs) {
                DSText("$29", .display)
                DSText("/mo", .caption, color: .dsTextMuted)
            }

            DSStack(.vertical, gap: .sm) {
                ForEach(features, id: \.self) { feature in
                    DSText(feature, .body)
                }
            }

            DSButton("Choose Pro") {}
                .dsButtonStyle(.primary, .lg)
        }
        .dsCard(.elevated)
    }
}

import SwiftUI

struct PricingCard: View {
    var body: some View {
        DSStack(.vertical, gap: .lg) {
            DSBadge("Most popular", tone: .info)

            DSStack(.vertical, gap: .xs) {
                DSText("Pro", .heading)
                DSText("Everything you need to ship faster.", .body, color: .dsTextSecondary)
            }

            DSStack(.horizontal, gap: .xs) {
                DSText("$29", .display)
                DSText("/mo", .caption, color: .dsTextMuted)
            }

            DSStack(.vertical, gap: .sm) {
                DSText("Unlimited projects", .body)
                DSText("Advanced analytics", .body)
                DSText("Priority support", .body)
            }

            DSButton("Choose Pro") {
                // action
            }
            .dsButtonStyle(.primary, .lg)
        }
        .dsCard(.elevated)
    }
}

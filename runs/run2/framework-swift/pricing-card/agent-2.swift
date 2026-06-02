import SwiftUI

/// Pricing card for the "Pro" tier.
///
/// Reuses only registered Aperture DS components and references only DS.* /
/// Color.ds* tokens. All spacing/layout flows through DSStack(gap:) and the
/// elevated surface is owned by .dsCard(.elevated) — no raw padding/background
/// chains, no literal numbers, no native styled controls.
struct PricingCard: View {
    private let features = [
        "Unlimited high-res exports",
        "Advanced editing tools",
        "Priority support",
    ]

    var body: some View {
        DSStack(.vertical, gap: .lg) {
            // Status pill — most specific registered component for a pill.
            DSBadge("Most popular", tone: .info)

            // Tier name + one-line description.
            DSStack(.vertical, gap: .xs) {
                DSText("Pro", .heading)
                DSText("Everything you need to ship faster.", .body, color: .dsTextSecondary)
            }

            // Price: large display value with a caption "/mo" beside it.
            DSStack(.horizontal, gap: .xs) {
                DSText("$29", .display)
                DSText("/mo", .caption, color: .dsTextSecondary)
            }

            // Feature lines.
            DSStack(.vertical, gap: .sm) {
                ForEach(features, id: \.self) { feature in
                    DSStack(.horizontal, gap: .sm) {
                        DSText("✓", .body, color: .dsActionPrimary)
                        DSText(feature, .body)
                    }
                }
            }

            // Full-width primary call-to-action.
            DSButton("Choose Pro") { choosePro() }
                .dsButtonStyle(.primary, .lg)
                .frame(maxWidth: .infinity)
        }
        .dsCard(.elevated)
    }

    private func choosePro() {}
}

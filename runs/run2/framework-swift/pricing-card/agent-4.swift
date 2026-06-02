import SwiftUI

/// Pricing card for the "Pro" tier.
///
/// Composition is fully delegated to registered DS components:
/// - `.dsCard(.elevated)` owns the surface inset, radius, and elevation.
/// - `DSStack(gap:)` owns every spacing decision (one canonical path for layout).
/// - `DSBadge` is the most specific component for the status pill.
/// - `DSText(_, .preset)` sets all type; no `.font(.system(size:))`.
/// - `DSButton(...).dsButtonStyle(.primary, .lg)` is the full-width CTA.
struct PricingCard: View {
    private let features = [
        "Unlimited high-res exports",
        "Advanced editing tools",
        "Priority support",
    ]

    var body: some View {
        DSStack(.vertical, gap: .lg) {
            // Status pill — most specific component for a pill.
            DSBadge("Most popular", tone: .info)

            // Tier name + one-line description.
            DSStack(.vertical, gap: .xs) {
                DSText("Pro", .heading)
                DSText(
                    "Everything you need to ship pro-grade photos.",
                    .body,
                    color: .dsTextSecondary
                )
            }

            // Price + per-month caption.
            DSStack(.horizontal, gap: .xs) {
                DSText("$29", .display)
                DSText("/mo", .caption, color: .dsTextMuted)
            }

            // Feature lines.
            DSStack(.vertical, gap: .sm) {
                ForEach(features, id: \.self) { feature in
                    DSText(feature, .body)
                }
            }

            // Full-width primary call to action.
            DSButton("Choose Pro") {}
                .dsButtonStyle(.primary, .lg)
        }
        .dsCard(.elevated)
    }
}

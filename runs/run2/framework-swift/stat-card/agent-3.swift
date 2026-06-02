import SwiftUI

// DS module in scope (Tokens.swift): DS.*, Color.ds*, .dsType, .dsShadow,
// and registered components DSText / DSStack / DSBadge live here.

/// Dashboard stat card: caption label, large display number, success badge.
/// Composition only — every value is a registered DS decision, no raw literals.
struct StatCard: View {
    // Content as data; variants (badge tone, type presets, stack gap) are DS enums.
    private let caption: String = "Monthly revenue"
    private let value: String = "$48.2k"
    private let delta: String = "+12.5%"

    var body: some View {
        // Vertical stack owns spacing via DS.Spacing token (gap: .sm).
        // .dsCard owns the surface inset, radius, and elevation — no .padding here.
        DSStack(.vertical, gap: .sm) {
            DSText(caption, .caption, color: .dsTextSecondary)
            DSText(value, .display)
            DSBadge(delta, tone: .success)
        }
        .dsCard(.elevated)
    }
}

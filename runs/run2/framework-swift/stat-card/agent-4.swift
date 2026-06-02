import SwiftUI

// DS module in scope (Tokens.swift + registered components).
// Reuses registered DS components only; no hand-rolled native equivalents.
// Type via DSText presets; spacing via DSStack(gap:); surface inset/radius/elevation via .dsCard.

struct StatCard: View {
    var body: some View {
        DSStack(.vertical, gap: .xs) {
            DSText("Monthly revenue", .caption, color: .dsTextSecondary)
            DSText("$48.2k", .display)
            DSBadge("+12.5%", tone: .success)
        }
        .dsCard(.elevated)
    }
}

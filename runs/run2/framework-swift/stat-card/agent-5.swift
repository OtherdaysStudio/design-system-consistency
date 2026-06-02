import SwiftUI

// DS module in scope (Tokens.swift): DS.*, Color.ds*, .dsType, .dsShadow,
// DSText, DSStack, DSBadge, .dsCard, etc.

struct StatCard: View {
    var body: some View {
        DSStack(.vertical, gap: .sm) {
            DSText("Monthly revenue", .caption, color: .dsTextSecondary)
            DSText("$48.2k", .display)
            DSBadge("+12.5%", tone: .success)
        }
        .dsCard(.default)
    }
}

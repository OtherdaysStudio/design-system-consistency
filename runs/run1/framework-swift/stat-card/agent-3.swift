import SwiftUI

struct StatCard: View {
    var body: some View {
        DSStack(.vertical, gap: .sm) {
            DSText("Monthly revenue", .caption, color: .dsTextSecondary)
            DSText("$48.2k", .display)
            DSBadge("+12.5%", tone: .success)
        }
        .dsCard(.elevated)
    }
}

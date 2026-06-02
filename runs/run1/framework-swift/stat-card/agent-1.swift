import SwiftUI

/// Dashboard stat card.
/// Composed entirely from registered Aperture DS components and tokens:
/// - DSStack(.vertical, gap:)  drives layout + spacing (DS.Spacing only)
/// - DSText(_:_:)              sets type via registered presets (.caption / .display)
/// - DSBadge(_:tone:)          success-toned status pill
/// - .dsCard(_:)               bounded surface (inset, radius, elevation)
/// No raw literals, no hand-rolled native controls.
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

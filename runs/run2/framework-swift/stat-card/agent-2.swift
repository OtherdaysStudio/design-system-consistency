import SwiftUI

// DS module in scope: DS.* tokens, Color.ds* semantics, DSText/DSStack/DSBadge,
// .dsCard / .dsType / .dsShadow. No raw literals — every value resolves to a token.

struct StatCard: View {
    enum Surface {
        case `default`
        case elevated

        var cardVariant: DSCardVariant {
            switch self {
            case .default: return .default
            case .elevated: return .elevated
            }
        }
    }

    let caption: String
    let value: String
    let delta: String
    var surface: Surface = .elevated

    init(
        caption: String = "Monthly revenue",
        value: String = "$48.2k",
        delta: String = "+12.5%",
        surface: Surface = .elevated
    ) {
        self.caption = caption
        self.value = value
        self.delta = delta
        self.surface = surface
    }

    var body: some View {
        // DSStack owns ALL spacing; .dsCard owns the surface insets/radius/elevation.
        DSStack(.vertical, gap: .sm) {
            DSText(caption, .caption, color: .dsTextSecondary)
            DSText(value, .display)
            DSBadge(delta, tone: .success)
        }
        .dsCard(surface.cardVariant)
    }
}

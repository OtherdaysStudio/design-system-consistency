import SwiftUI

/// A user profile header row: circular avatar, a name/role block with a "Pro"
/// badge, and a primary "Follow" action on the trailing edge.
///
/// Built entirely from registered Aperture DS components — all spacing flows
/// through `DSStack(gap:)`, type through `DSText` presets, and every value
/// references a DS token. No raw literals, no hand-rolled native equivalents.
struct ProfileHeader: View {
    let name: String
    let role: String
    let onFollow: () -> Void

    init(
        name: String = "Ada Lovelace",
        role: String = "Product Designer",
        onFollow: @escaping () -> Void = {}
    ) {
        self.name = name
        self.role = role
        self.onFollow = onFollow
    }

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            DSAvatar(name: name, size: .lg)

            DSStack(.vertical, gap: .xs) {
                DSText(name, .title)

                DSStack(.horizontal, gap: .sm) {
                    DSText(role, .body, color: .dsTextSecondary)
                    DSBadge("Pro", tone: .neutral)
                }
            }

            Spacer()

            DSButton("Follow", action: onFollow)
                .dsButtonStyle(.primary, .md)
        }
    }
}

import SwiftUI

/// Profile header row: circular avatar, a name/role block with a neutral "Pro"
/// badge, and a trailing primary "Follow" button. Horizontal, vertically centered.
///
/// Every visual element is REUSED from the registered Aperture DS — no hand-rolled
/// components, no raw literals. Type is set only via DSText presets; spacing only
/// via DSStack(gap:) tokens.
struct ProfileHeader: View {
    let name: String
    var role: String = "Product Designer"

    var onFollow: () -> Void = {}

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            // Circular avatar — registered DS component.
            DSAvatar(name: name, size: .lg)

            // Name (title) + role (secondary) with an inline neutral badge.
            DSStack(.vertical, gap: .xs) {
                DSText(name, .title)

                DSStack(.horizontal, gap: .sm) {
                    DSText(role, .body, color: .dsTextSecondary)
                    DSBadge("Pro", tone: .neutral)
                }
            }

            // Push the action to the trailing edge; vertical centering comes
            // from DSStack's horizontal axis default alignment.
            Spacer()

            DSButton("Follow", action: onFollow)
                .dsButtonStyle(.primary, .md)
        }
    }
}

import SwiftUI

/// A user profile header row.
/// Horizontal, vertically centered: circular avatar, an identity block
/// (name + role + Pro badge), and a primary Follow action on the trailing edge.
struct ProfileHeader: View {
    let name: String
    let role: String
    var onFollow: () -> Void = {}

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            DSAvatar(name: name, size: .md)

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

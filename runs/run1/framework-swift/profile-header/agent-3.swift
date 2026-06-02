import SwiftUI

/// Profile header row: avatar, name + role + Pro badge block, and a Follow action.
/// Built entirely from registered Aperture DS components and tokens.
struct ProfileHeader: View {
    let name: String
    let role: String

    init(name: String = "Ada Lovelace", role: String = "Product Designer") {
        self.name = name
        self.role = role
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

            DSButton("Follow") { follow() }
                .dsButtonStyle(.primary, .md)
        }
    }

    private func follow() {}
}

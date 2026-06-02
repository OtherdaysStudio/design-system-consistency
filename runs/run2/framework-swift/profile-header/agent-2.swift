import SwiftUI

/// A horizontal profile header row: avatar, name + role + badge block, and a primary follow action.
/// Spacing/layout flows exclusively through DSStack(gap:); each DS component owns its own styling.
struct ProfileHeader: View {
    let name: String
    let role: String

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

#Preview {
    ProfileHeader(name: "Ada Lovelace", role: "Product Designer")
}

import SwiftUI

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

            Spacer(minLength: DS.Spacing.md)

            DSButton("Follow") { follow() }
                .dsButtonStyle(.primary, .md)
        }
    }

    private func follow() {}
}

import SwiftUI

struct SettingsRow: View {
    @State private var isNotificationsOn = true

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            DSStack(.vertical, gap: .xs) {
                DSText("Push notifications", .body)
                DSText("Get notified about activity", .caption, color: .dsTextSecondary)
            }

            Spacer()

            DSToggle("Push notifications", isOn: $isNotificationsOn)
                .dsToggleStyle(.ds)
                .labelsHidden()
        }
        .dsCard(.default)
    }
}

import SwiftUI

struct SettingsRow: View {
    @State private var isOn: Bool = true

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            DSStack(.vertical, gap: .xs) {
                DSText("Push notifications", .label)
                DSText("Get notified about activity", .caption, color: .dsTextSecondary)
            }

            Spacer()

            DSToggle("Push notifications", isOn: $isOn)
                .labelsHidden()
        }
        .dsCard(.default)
    }
}

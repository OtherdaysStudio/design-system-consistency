import SwiftUI

/// A single settings list row presenting a primary label with a secondary
/// helper line on the left and a toggle switch on the right.
struct SettingsRow: View {
    @State private var isOn: Bool = true

    var body: some View {
        HStack(alignment: .center, spacing: 16) {
            VStack(alignment: .leading, spacing: 3) {
                Text("Push notifications")
                    .font(.body)
                    .fontWeight(.medium)
                    .foregroundStyle(.primary)

                Text("Get notified about activity")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            Toggle("Push notifications", isOn: $isOn)
                .labelsHidden()
                .tint(.green)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 14)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color(.secondarySystemGroupedBackground))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.06), lineWidth: 0.5)
        )
        .accessibilityElement(children: .combine)
    }
}

#Preview {
    ZStack {
        Color(.systemGroupedBackground)
            .ignoresSafeArea()

        SettingsRow()
            .padding(.horizontal, 20)
    }
}

import SwiftUI

/// A single, polished settings list row with a label, a secondary helper line,
/// and a trailing toggle switch.
struct SettingsRow: View {
    @State private var isOn: Bool = true

    var body: some View {
        HStack(alignment: .center, spacing: 16) {
            VStack(alignment: .leading, spacing: 3) {
                Text("Push notifications")
                    .font(.system(.body, design: .default).weight(.semibold))
                    .foregroundStyle(.primary)

                Text("Get notified about activity")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(.accentColor)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 14)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(.background)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .strokeBorder(.quaternary, lineWidth: 0.5)
        )
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
        .accessibilityElement(children: .combine)
    }
}

#Preview("Settings Row") {
    VStack(spacing: 12) {
        SettingsRow()
    }
    .padding(20)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(Color(.systemGroupedBackground))
}

#Preview("Dark") {
    VStack(spacing: 12) {
        SettingsRow()
    }
    .padding(20)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(Color(.systemGroupedBackground))
    .preferredColorScheme(.dark)
}

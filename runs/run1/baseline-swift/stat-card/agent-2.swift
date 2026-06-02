import SwiftUI

/// A dashboard statistic card showing a metric label, a large display value,
/// and a success-toned change badge, stacked vertically on an elevated surface.
struct StatCard: View {
    var caption: String = "Monthly revenue"
    var value: String = "$48.2k"
    var change: String = "+12.5%"

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Caption
            Text(caption)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(.secondary)
                .textCase(.uppercase)
                .kerning(0.6)

            // Display value
            Text(value)
                .font(.system(size: 44, weight: .bold, design: .rounded))
                .foregroundStyle(.primary)
                .contentTransition(.numericText())
                .minimumScaleFactor(0.7)
                .lineLimit(1)

            // Success badge
            ChangeBadge(text: change)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(.background)
                .shadow(color: .black.opacity(0.08), radius: 20, x: 0, y: 10)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .strokeBorder(.primary.opacity(0.06), lineWidth: 1)
        )
    }
}

/// A pill-shaped badge using a positive/success green tone, with a trend glyph.
private struct ChangeBadge: View {
    let text: String

    private var successColor: Color {
        Color(red: 0.13, green: 0.66, blue: 0.42)
    }

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "arrow.up.right")
                .font(.caption2.weight(.bold))
            Text(text)
                .font(.subheadline.weight(.semibold))
        }
        .foregroundStyle(successColor)
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(
            Capsule(style: .continuous)
                .fill(successColor.opacity(0.14))
        )
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Up \(text)")
    }
}

#Preview {
    ZStack {
        Color(.systemGroupedBackground)
            .ignoresSafeArea()

        StatCard()
            .padding(32)
    }
}

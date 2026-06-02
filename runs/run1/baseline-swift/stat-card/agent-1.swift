import SwiftUI

/// A polished dashboard stat card displaying a metric label, a large display
/// value, and a success-toned change badge stacked vertically on a surface.
struct StatCard: View {
    var caption: String = "Monthly revenue"
    var value: String = "$48.2k"
    var change: String = "+12.5%"

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Caption label
            Text(caption.uppercased())
                .font(.system(size: 12, weight: .semibold, design: .rounded))
                .tracking(0.8)
                .foregroundStyle(.secondary)

            // Large display number
            Text(value)
                .font(.system(size: 40, weight: .bold, design: .rounded))
                .foregroundStyle(.primary)
                .contentTransition(.numericText())
                .minimumScaleFactor(0.7)
                .lineLimit(1)

            // Success-toned change badge
            ChangeBadge(text: change)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .fill(.background)
                .shadow(
                    color: .black.opacity(0.08),
                    radius: 18,
                    x: 0,
                    y: 8
                )
        )
        .overlay(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .strokeBorder(.primary.opacity(0.06), lineWidth: 1)
        )
    }
}

/// A pill-shaped badge tinted with a success color, used to surface a positive
/// delta alongside an upward trend glyph.
private struct ChangeBadge: View {
    let text: String

    private var accent: Color {
        Color(red: 0.13, green: 0.66, blue: 0.42)
    }

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "arrow.up.right")
                .font(.system(size: 11, weight: .bold))
            Text(text)
                .font(.system(size: 13, weight: .semibold, design: .rounded))
        }
        .foregroundStyle(accent)
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(
            Capsule(style: .continuous)
                .fill(accent.opacity(0.12))
        )
    }
}

#Preview {
    ZStack {
        Color(.systemGroupedBackground)
            .ignoresSafeArea()

        StatCard()
            .frame(width: 260)
            .padding()
    }
}

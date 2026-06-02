// Aperture DS — DSBadge
// A small inline status/label pill. Tone is a Swift enum; fill + foreground
// resolve to status color tokens.
//
// Usage: DSBadge("New", tone: .info)
//        DSBadge("Active", tone: .success)
import SwiftUI

public struct DSBadge: View {
    public enum Tone {
        case neutral, success, warning, danger, info

        var foreground: Color {
            switch self {
            case .neutral: return .dsTextSecondary
            case .success: return .dsStatusSuccess
            case .warning: return .dsStatusWarning
            case .danger:  return .dsStatusDanger
            case .info:    return .dsStatusInfo
            }
        }

        var background: Color {
            switch self {
            case .neutral: return .dsBgMuted
            case .success: return .dsStatusSuccessBg
            case .warning: return .dsStatusWarningBg
            case .danger:  return .dsStatusDangerBg
            case .info:    return .dsStatusInfoBg
            }
        }
    }

    private let label: String
    private let tone: Tone

    public init(_ label: String, tone: Tone = .neutral) {
        self.label = label
        self.tone = tone
    }

    public var body: some View {
        Text(label)
            .dsType(.caption)                      // type.caption
            .foregroundStyle(tone.foreground)
            .padding(.horizontal, DS.Spacing.sm)   // badge.paddingX
            .padding(.vertical, DS.Spacing.xs)
            .background(
                RoundedRectangle(cornerRadius: DS.Radius.pill, style: .continuous) // badge.radius
                    .fill(tone.background)
            )
    }
}

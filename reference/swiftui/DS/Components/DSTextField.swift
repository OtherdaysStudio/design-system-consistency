// Aperture DS — DSTextField
// A single-line text input with consistent height, radius, border and focus
// ring. State is a Swift enum (default | error | disabled); all visual values
// come from DS.* / Color.ds*.
//
// Usage: DSTextField("Email", text: $email)
//        DSTextField("Email", text: $email, state: .error)
import SwiftUI

public struct DSTextField: View {
    public enum State {
        case `default`, error, disabled

        var borderColor: Color {
            switch self {
            case .default:  return .dsBorderDefault   // color.border.default
            case .error:    return .dsStatusDanger    // error outline
            case .disabled: return .dsBorderDefault
            }
        }

        var borderWidth: CGFloat {
            switch self {
            case .default:  return DS.BorderWidth.thin
            case .error:    return DS.BorderWidth.thick // emphasis
            case .disabled: return DS.BorderWidth.thin
            }
        }

        var background: Color {
            switch self {
            case .disabled: return .dsBgMuted
            default:        return .dsBgSurface
            }
        }

        var foreground: Color {
            switch self {
            case .disabled: return .dsTextMuted
            default:        return .dsTextPrimary
            }
        }

        var isDisabled: Bool { self == .disabled }
    }

    private let placeholder: String
    @Binding private var text: String
    private let state: State

    public init(_ placeholder: String, text: Binding<String>, state: State = .default) {
        self.placeholder = placeholder
        self._text = text
        self.state = state
    }

    public var body: some View {
        TextField(placeholder, text: $text)
            .textFieldStyle(.plain)
            .dsType(.body)                              // type.body
            .foregroundStyle(state.foreground)
            .padding(.horizontal, DS.Spacing.md)        // input.paddingX
            .frame(height: DS.Size.controlMd)           // input.height
            .background(
                RoundedRectangle(cornerRadius: DS.Radius.md, style: .continuous) // input.radius
                    .fill(state.background)
            )
            .overlay(
                RoundedRectangle(cornerRadius: DS.Radius.md, style: .continuous)
                    .strokeBorder(state.borderColor, lineWidth: state.borderWidth)
            )
            .disabled(state.isDisabled)
    }
}

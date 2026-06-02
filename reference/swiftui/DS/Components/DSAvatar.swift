// Aperture DS — DSAvatar
// Circular user image / initials at registered sizes. Size is a Swift enum;
// diameter resolves to a control-size token, corner to radius.pill. Never set
// a raw frame size or Color literal.
//
// Usage: DSAvatar(name: "Ada Lovelace", size: .md)
//        DSAvatar(name: "Ada Lovelace", image: Image("ada"), size: .lg)
import SwiftUI

public struct DSAvatar: View {
    public enum Size {
        case sm, md, lg
        var diameter: CGFloat {
            switch self {
            case .sm: return DS.Size.controlSm   // 32
            case .md: return DS.Size.controlMd   // 40
            case .lg: return DS.Size.controlLg   // 48
            }
        }
        var preset: DSTypePreset {
            switch self {
            case .sm: return .caption
            case .md: return .label
            case .lg: return .body
            }
        }
    }

    private let name: String
    private let image: Image?
    private let size: Size

    public init(name: String, image: Image? = nil, size: Size = .md) {
        self.name = name
        self.image = image
        self.size = size
    }

    private var initials: String {
        let parts = name.split(separator: " ").prefix(2)
        return parts.compactMap { $0.first.map(String.init) }.joined().uppercased()
    }

    public var body: some View {
        Group {
            if let image {
                image.resizable().scaledToFill()
            } else {
                DSText(initials, size.preset, color: .dsTextSecondary)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.dsBgMuted)
            }
        }
        .frame(width: size.diameter, height: size.diameter)
        .clipShape(Circle())
        .accessibilityLabel(name)
    }
}

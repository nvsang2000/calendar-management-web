import { Image } from 'antd'

export default function adminPage() {
  return (
    <div className='!bg-white'>
      Ant Design allows you to customize our design tokens to satisfy UI
      diversity from business or brand requirements, including primary color,
      border radius, border color, etc. In version 5.0, we provide a new way to
      customize themes. Different from the less and CSS variables of the 4.x
      version, with CSS-in-JS, the ability of theming has also been enhanced,
      including but not limited to: Switching theme dynamically； Multiple
      themes； Customizing theme variables for some component； ... Basic Usage
      In version 5.0 we call the smallest element that affects the theme Design
      Token. By modifying the Design Token, we can present various themes or
      components. You can pass theme to `ConfigProvider`` to customize theme.
      After migrate to V5, theme of V5 will be applied by default WARNING
      ConfigProvider will not take effect on static methods such as message.xxx,
      Modal.xxx, notification.xxx, because in these methods, antd will
      dynamically create new ones through ReactDOM.render React entities. Its
      context is not the same as the context of the current code, so context
      information cannot be obtained. When you need context information (such as
      the content configured by ConfigProvider), you can use the Modal.useModal
      method to return the modal entity and the contextHolder node. Just insert
      it where you need to get the context, or you can use App Component to
      simplify the problem of usingModal and other methods that need to manually
      implant the contextHolder.
    </div>
  )
}

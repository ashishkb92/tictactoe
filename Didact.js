// only initial implement
// const element = {
//   type: "h1",
//   props: {
//     title: "foo",
//     children: "Hello",
//   }
// }

// const container = document.getElementById('root')
// const node = document.createElement(element.type)
// node.title = element.props.title;
// const text = document.createTextNode("")
// text.nodeValue = element.props.children
// node.appendChild(text)
// container.appendChild(node)
// console.log(container);

const Didact = {
  createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) =>
          typeof child === 'object' ? child : this.createTextElement(child)
        )
      }
    };
  },
  createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: []
      }
    };
  }
};

const DidactDOM = {
  render(element, container) {
    const dom =
      element.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(element.type);
    // ​ element.props.children.forEach(child => render(child, dom))
    element.props.children.forEach((child) => this.render(child, dom));

    const isProperty = (key) => key !== 'children';
    Object.keys(element.props)
      .filter(isProperty)
      .forEach((name) => {
        dom[name] = element.props[name];
      });
    container.appendChild(dom);
  }
};

const element = Didact.createElement(
  'div',
  { id: 'foo' },
  Didact.createElement('a', null, 'bar'),
  Didact.createElement('b', {}, 'Hi')
);
const container = document.getElementById('root');

DidactDOM.render(element, container);

/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Context } from '@interfaces/editGui';
import { storeIntegrationConfig } from '@utils/localStorage';

export default class FusebitEditor extends React.Component<any> {
  private el: any;

  private editorContext: any;

  componentDidMount() {
    const initializeEditor = () => {
      // @ts-ignore
      window.fusebit
        .createEditor(this.el, this.props.boundaryId, this.props.functionId, this.props.account, this.props.options)
        .then((editorContext: Context) => {
          this.editorContext = editorContext;
          window.editor = this.editorContext;
          storeIntegrationConfig(this.props.functionId, {
            runner: editorContext.specification.data.fusebitEditor?.runConfig?.[0],
          });
          if (this.props.onLoaded) {
            this.props.onLoaded();
          }
        })
        .catch((e: any) => {
          if (this.props.onError) {
            this.props.onError(e);
          } else {
            throw e;
          }
        });
    };
    const fusebitLibUrl = `https://cdn.fusebit.io/fusebit/js/fusebit-editor/${(this.props.version || 'latest').replace(
      /\./g,
      '/'
    )}/fusebit-editor.min.js`;

    const script = document.createElement('script');
    script.src = fusebitLibUrl;
    script.async = true;
    script.onload = () => initializeEditor();
    document.head.appendChild(script);
  }

  componentWillUnmount() {
    if (this.editorContext) {
      this.editorContext.dispose();
      this.editorContext = undefined;
    }
  }

  render() {
    return (
      <div
        ref={(el) => {
          this.el = el;
        }}
      />
    );
  }
}

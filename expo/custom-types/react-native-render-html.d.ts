// tslint:disable
declare module 'react-native-render-html' {
	import { ComponentType, ReactNode } from 'react';
	import { Falsy, GestureResponderEvent, RecursiveArray, StyleProp, TextStyle, View } from 'react-native';
	namespace HTML {
		type HTMLNode = any;
		type NonRegisteredStylesProp<T> = T | Falsy | RecursiveArray<T | Falsy>;
		interface HtmlAttributesDictionary {
			[attribute: string]: string;
		}
		type PassProps<T> = any;
		type RendererFunction = <T>(htmlAttribs: HtmlAttributesDictionary, children: HTMLNode[], convertedCSSStyles: NonRegisteredStylesProp<any>, passProps: PassProps<T>) => ReactNode;
		type RendererDeclaration = RendererFunction | { renderer: RendererFunction, wrapper: 'Text' | 'View' };
		interface RendererDictionary {
			[tag: string]: RendererDeclaration;
		}
		interface StylesDictionary {
			[tag: string]: NonRegisteredStylesProp<any>;
		}
		interface ImageDimensions {
			width: number;
			height: number;
		}
		interface ContainerProps {
			/**
			 * HTML string to parse and render
			 */
			html: string;
			/**
			 * Resize your images to this maximum width.
			 */
			imagesMaxWidth?: number;
			/**
			 * Your custom renderers.
			 */
			renderers?: RendererDictionary;
			/**
			 * Your custom renderers from ul and ol bullets, see [lists prefixes](https://github.com/archriss/react-native-render-html#lists-prefixes)
			 */
			listsPrefixesRenderers?: RendererDictionary;
			/**
			 * Remote website to parse and render
			 */
			uri?: string;
			/**
			 * Decode HTML entities of your content.
			 * Optional, defaults to true
			 */
			decodeEntities?: boolean;
			/**
			 * Set a maximum width to non-responsive content (<iframe> for instance)
			 */
			staticContentMaxWidth?: number;
			/**
			 * Default width and height to display while image's dimensions are being retrieved.
			 */
			imagesInitialDimensions?: ImageDimensions;
			/**
			 * Fired with the event, the href and an object with all attributes of the tag as its arguments when tapping a link
			 */
			onLinkPress?: (event: GestureResponderEvent, href: string, htmlAttribs: HtmlAttributesDictionary) => void;
			/**
			 * Fired when your HTML content has been parsed. Also useful to tweak your rendering.
			 */
			onParsed?: any;
			/**
			 * Provide your styles for specific HTML tags.
			 *
			 * **Important note** Do NOT use the StyleSheet API to create the styles you're going to feed to tagsStyle and classesStyles.
			 * Although it might look like it's working at first, the caching logic of react-native makes it impossible for this module
			 * to deep check each of your style to properly apply the precedence and priorities of your nested tags' styles.
			 */
			tagsStyles?: StylesDictionary;
			/**
			 * Provide your styles for specific HTML classes.
			 *
			 * **Important note** Do NOT use the StyleSheet API to create the styles you're going to feed to tagsStyle and classesStyles.
			 * Although it might look like it's working at first, the caching logic of react-native makes it impossible for this module
			 * to deep check each of your style to properly apply the precedence and priorities of your nested tags' styles.
			 */
			classesStyles?: StylesDictionary;
			/**
			 * Custom style for the default container of the renderered HTML.
			 */
			containerStyle?: StyleProp<View>;
			/**
			 * Replace the default wrapper with a function that takes your content as the first parameter.
			 */
			customWrapper?: Function;
			/**
			 * Replace the default loader while fetching a remote website's content.
			 */
			remoteLoadingView?: Function;
			/**
			 * Replace the default error if a remote website's content could not be fetched.
			 */
			remoteErrorView?: Function;
			/**
			 * The default value in pixels for 1em
			 */
			emSize?: number;
			/**
			 * The default value in pixels for 1pt
			 */
			ptSize?: number;
			/**
			 * The default style applied to `<Text>` components
			 */
			baseFontStyle?: NonRegisteredStylesProp<TextStyle>;
			/**
			 * Allow all texts to be selected. Default to `false`.
			 */
			textSelectable?: boolean;
			/**
			 * Target some specific texts and change their content, see [altering content](https://github.com/archriss/react-native-render-html#altering-content)
			 */
			alterData?: (...args: any[]) => any;
			/**
			 * Target some specific nested children and change them, see [altering content](https://github.com/archriss/react-native-render-html#altering-content)
			 */
			alterChildren?: (...args: any[]) => any;
			/**
			 * Target a specific node and change it, see [altering content](https://github.com/archriss/react-native-render-html#altering-content)
			 */
			alterNode?: (...args: any[]) => any;
			/**
			 * HTML tags you don't want rendered, see [ignoring HTML content](https://github.com/archriss/react-native-render-html#ignoring-html-content)
			 */
			ingoredTags?: string[];
			/**
			 * Allow render only certain CSS style properties and ignore every other. If you have some property both in `allowedStyles` and `ignoredStyles`, it will be ignored anyway.
			 */
			allowedStyles?: string[];
			/**
			 * CSS styles from the style attribute you don't want rendered, see [ignoring HTML content](https://github.com/archriss/react-native-render-html#ignoring-html-content)
			 */
			ignoredStyles?: string[];
			/**
			 * Return true in this custom function to ignore nodes very precisely, see [ignoring HTML content](https://github.com/archriss/react-native-render-html#ignoring-html-content)
			 */
			ignoreNodesFunction?: (node: HTMLNode) => boolean;
			/**
			 * Prints the parsing result from htmlparser2 and render-html after the initial render
			 */
			debug?: boolean;
		}
	}
	const HTML: ComponentType<HTML.ContainerProps>;
	export = HTML;
}

declare module 'react-native-render-html/src/HTMLUtils' {
	type HTMLNode = any;
	/**
	 * Returns an array with the tagname of every parent of a node or an empty array if nothing is found.
	 * @param node A parsed HTML node from alterChildren for example
	 */
	export const getParentsTagsRecursively: (node: HTMLNode) => string[];

	/**
	 * Returns the closest parent of a node with a specific tag.
	 * @param node A parsed HTML node from alterChildren for example
	 * @param tag The tag to match
	 */
	export const getClosestNodeParentByTag: (node: HTMLNode, tag: string) => HTMLNode;

	/**
	 * The set of default ignored tags
	 */
	export const IGNORED_TAGS: string[];
}

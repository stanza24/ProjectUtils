import React from 'react';
// eslint-disable-next-line no-restricted-imports
import {RouteComponentProps} from 'react-router';
// eslint-disable-next-line no-restricted-imports
import {Route, RouteProps} from 'react-router-dom';

const RouteWrapComponent: React.FunctionComponent<RouteProps> = <T extends RouteProps>(props: T): JSX.Element => {
    const {component, children, ...restProps} = props;

    if (component) {
        /**
         * Переопределяем тип компонента, чтобы он не кричал на отсутсвие пропсов history и staticContext.
         */
        const Component = component as
            | React.ComponentType<Omit<RouteComponentProps, 'history' | 'staticContext'>>
            | React.ComponentType<unknown>;

        /**
         * Мы передаем все пропсы, кроме history и staticContext.
         *
         * history мы не передаём потому что используем RouterUtils
         * staticContext мы не передаем потому что он учавствует только в SSR, если будет нужно то докинем его
         */
        return (
            <Route
                {...restProps}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({history, staticContext, ...renderProps}) => <Component {...renderProps}>{children}</Component>}
            />
        );
    }

    return <Route {...props} />;
};

export {RouteWrapComponent as Route};

import _ from 'lodash';
import { Container, injectable } from 'inversify';
import 'reflect-metadata';
import getDecorators from 'inversify-inject-decorators';

const container = new Container({
    defaultScope: 'Singleton',
    autoBindInjectable: false
});

const { lazyInject } = getDecorators(container);

export { container, lazyInject };

export function provideComponent<T extends Constructor>(name?: string) {
    return (constructor: T) => {
        const target = constructor.prototype;
        let componentName = name;
        if (!componentName) {
            componentName = _.snakeCase(_.replace(constructor.name, /component$/i, ''));
        }
        target._name = componentName;
        container.bind(constructor).to(injectable()(constructor));
    };
}

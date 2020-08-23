package com.code.ecommerce.config;

import com.code.ecommerce.entity.Country;
import com.code.ecommerce.entity.Product;
import com.code.ecommerce.entity.ProductCategory;
import com.code.ecommerce.entity.State;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
@AllArgsConstructor
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

        HttpMethod[] unsupportedMethods = {HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PUT};

        // disable http methods for entities: PUT, POST, and DELETE
        disableHttpMethods(Product.class, config, unsupportedMethods);
        disableHttpMethods(ProductCategory.class, config, unsupportedMethods);
        disableHttpMethods(Country.class, config, unsupportedMethods);
        disableHttpMethods(State.class, config, unsupportedMethods);

        // call an internal helper method
        exposeIds(config);
    }

    private void disableHttpMethods(Class<?> theClass, RepositoryRestConfiguration config, HttpMethod[] unsupportedMethods) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedMethods)))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedMethods));
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        // get a list from all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        for (EntityType<?> type : entities) {
            entityClasses.add(type.getJavaType());
        }

        // expose the ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
